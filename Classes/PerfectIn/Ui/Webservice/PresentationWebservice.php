<?php

namespace PerfectIn\Ui\Webservice;

use TYPO3\Flow\Annotations as Flow;
use PerfectIn\Webservice\Annotations as Webservice;

class PresentationWebservice {
	
	
	/**
	 * @var \PerfectIn\Ui\Service\PresentationService
	 * @Flow\Inject
	 */
	protected $presentationService;
	
	/**
	 * create presentation
	 *
	 * @param string $module
	 * @param string $name
	 * @Webservice\Rest(method="POST",uri="webservice/ui/presentation")
	 */
	public function create($module, $name) {
		$this->presentationService->createPresentation($module, $name);
	}
	
	/**
	 * save presentation
	 * 
	 * @param string $module
	 * @param string $name
	 * @param array $config
	 * @Webservice\Rest(method="PUT",uri="webservice/ui/presentation")
	 */
	public function update($module, $name, $config) {
		
	}
	
	/**
	 * get presentation
	 *
	 * @param string $name
	 * @Webservice\Rest(method="GET",uri="webservice/ui/presentation/{name}")
	 * @return array
	 */
	public function get($name) {
		return $this->presentationService->getYamlConfiguration($name);
	}
	
	
	/**
	 * get all presentations
	 *
	 * @Webservice\Rest(method="GET",uri="webservice/ui/presentation")
	 * @return array
	 */
	public function getAll() {
		return $this->presentationService->getYamlConfigurations();
	}
}